"use client";

import { useState, useEffect } from "react";
import { productCategoryService } from "@/services/product-category-service";
import { ProductCategoryResponse } from "@/types/product-category";
import CategoryTable from "./category-table";
import CreateCategoryDialog from "./create-category-dialog";

export default function CategoriesTab() {

    const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await productCategoryService.getAllCategories();
            setCategories(response.data);
        } catch {
            console.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center
                            lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Product Categories
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({categories.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage chocolate product categories
                    </p>
                </div>
                <CreateCategoryDialog onSuccess={fetchCategories} />
            </div>

            <CategoryTable
                categories={categories}
                loading={loading}
                onRefresh={fetchCategories}
            />
        </div>
    );
}