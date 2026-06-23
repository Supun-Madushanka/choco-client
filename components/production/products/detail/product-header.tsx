"use client";

import { ProductResponse } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductHeaderProps {
    product: ProductResponse;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
    return (
        <Card className="border-cream-200 shadow-card mb-4">
            <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start
                                sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold text-text-primary">
                                {product.name}
                            </h2>
                            <Badge
                                variant="outline"
                                className={`text-xs ${
                                    product.isActive
                                        ? "bg-success-light text-success border-success/20"
                                        : "bg-cream-100 text-text-muted border-cream-200"
                                }`}>
                                {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge
                                variant="outline"
                                className="text-xs font-mono border-cream-200 text-text-secondary">
                                {product.code}
                            </Badge>
                            <span className="text-sm text-text-muted">
                                {product.categoryName}
                            </span>
                        </div>

                        {product.variant && (
                            <p className="text-sm text-text-secondary mt-1">
                                Variant: {product.variant}
                            </p>
                        )}
                        {product.packagingType && (
                            <p className="text-sm text-text-secondary mt-0.5">
                                Packaging: {product.packagingType}
                            </p>
                        )}
                        {product.description && (
                            <p className="text-sm text-text-muted mt-2 max-w-xl">
                                {product.description}
                            </p>
                        )}
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-xs text-text-muted">Selling Price</p>
                        <p className="text-xl font-bold text-text-primary">
                            LKR {product.sellingPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                            Unit: {product.unit}
                            {product.weightPerUnit &&
                                ` · ${product.weightPerUnit}g/unit`}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}