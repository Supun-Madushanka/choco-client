"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/services/product-service";
import { ProductResponse } from "@/types/product";
import PageHeader from "@/components/common/page-header";
import ProductHeader from "@/components/production/products/detail/product-header";
import ProductBomSection from "@/components/production/products/detail/product-bom-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {

    const params = useParams();
    const id = Number(params.id);

    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productService.getProductById(id);
            setProduct(response.data);
        } catch {
            console.error("Failed to fetch product");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading || !product) {
        return (
            <div>
                <PageHeader title="Product" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={product.name}
                description="Product details and bill of materials"
            />
            <ProductHeader product={product} />
            <ProductBomSection productId={product.id} />
        </div>
    );
}