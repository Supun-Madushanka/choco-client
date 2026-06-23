"use client";

import { useState, useEffect } from "react";
import { productService } from "@/services/product-service";
import { ProductResponse } from "@/types/product";
import ProductsTable from "./products-table";
import CreateProductDialog from "./create-product-dialog";

export default function ProductsTab() {

    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getAllProducts();
            setProducts(response.data);
        } catch {
            console.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center
                            lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Products
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({products.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage chocolate products and recipes
                    </p>
                </div>
                <CreateProductDialog onSuccess={fetchProducts} />
            </div>

            <ProductsTable
                products={products}
                loading={loading}
                onRefresh={fetchProducts}
            />
        </div>
    );
}